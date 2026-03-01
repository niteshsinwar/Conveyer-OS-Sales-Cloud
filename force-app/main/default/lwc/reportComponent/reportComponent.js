import { LightningElement, api, wire, track } from 'lwc';
import getProjectSummary from '@salesforce/apex/ProjectController.getProjectSummary';
import { loadScript } from 'lightning/platformResourceLoader';
import chartJS from '@salesforce/resourceUrl/chartJS'; // Chart.js UMD file
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ReportComponent extends LightningElement {
    @api chartTitle = 'Project Status Distribution';
    @api chartType = 'pie'; // pie, doughnut, bar, etc.
    @api height = 300;
    showLegend = true;
    
    @track isLoading = true;
    @track chartData = [];
    @track chartLabels = [];
    @track error;
    @track chartMetadata = [];
    
    chart;
    chartJsInitialized = false;
    libraryLoaded = false;
    chartColors = [
        '#3366CC', '#DC3912', '#FF9900', '#109618', 
        '#990099', '#0099C6', '#DD4477', '#66AA00', 
        '#B82E2E', '#316395', '#994499', '#22AA99'
    ];
    
    // Store wire result for refreshing
    wiredSummaryResult;

    @wire(getProjectSummary)
    wiredProjectSummary(result) {
        this.wiredSummaryResult = result;
        const { data, error } = result;
        
        if (data) {
            this.processChartData(data);
            this.error = undefined;
        } else if (error) {
            this.handleError(error);
            this.chartData = [];
            this.chartLabels = [];
        }
        
        this.isLoading = false;
        // Attempt to render chart if library is already loaded
        if (this.libraryLoaded) {
            this.renderChart();
        }
    }

    processChartData(data) {
        try {
            // Extract data for chart
            this.chartData = data.map(record => record.recordCount);
            this.chartLabels = data.map(record => record.status);
            
            // Calculate total for percentages
            const total = this.chartData.reduce((sum, count) => sum + count, 0);
            
            // Store additional metadata for tooltips/display
            this.chartMetadata = data.map((record, index) => ({
                label: record.status,
                count: record.recordCount,
                percentage: ((record.recordCount / total) * 100).toFixed(1) + '%'
            }));
        } catch (error) {
            this.handleError(error);
        }
    }

    renderedCallback() {
        if (this.chartJsInitialized) {
            return;
        }
        
        this.chartJsInitialized = true;
        this.isLoading = true;
        
        loadScript(this, chartJS)
            .then(() => {
                this.libraryLoaded = true;
                // Only render if we have data
                if (this.hasData) {
                    this.renderChart();
                }
            })
            .catch(error => {
                this.chartJsInitialized = false; // Reset so we can try loading again
                this.handleError(error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    renderChart() {
        // Only proceed if we have data and the Chart.js library is loaded
        if (!this.libraryLoaded || !this.hasData) {
            return;
        }

        const canvas = this.template.querySelector('canvas.chart');
        if (!canvas) {
            // Canvas not in DOM yet, schedule rerender
            window.requestAnimationFrame(() => {
                this.renderChart();
            });
            return;
        }

        try {
            // Set canvas dimensions based on container
            this.resizeCanvas(canvas);
            
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart instance if it exists
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }

            // Create new chart with enhanced configuration
            this.chart = new window.Chart(ctx, this.getChartConfig());
        } catch (error) {
            this.handleError(error);
        }
    }

    getChartConfig() {
        return {
            type: this.chartType,
            data: {
                labels: this.chartLabels,
                datasets: [{
                    data: this.chartData,
                    backgroundColor: this.chartColors.slice(0, this.chartData.length),
                    borderColor: 'white',
                    borderWidth: 1,
                    hoverBorderWidth: 2,
                    hoverBackgroundColor: this.chartColors.map(color => this.adjustBrightness(color, 0.1))
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: this.showLegend,
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            boxWidth: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const index = context.dataIndex;
                                const metadata = this.chartMetadata[index];
                                return `${metadata.label}: ${metadata.count} (${metadata.percentage})`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: this.chartTitle,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000
                }
            }
        };
    }

    // Helper method to adjust color brightness for hover effects
    adjustBrightness(hex, factor) {
        hex = hex.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        r = Math.min(255, Math.floor(r * (1 + factor)));
        g = Math.min(255, Math.floor(g * (1 + factor)));
        b = Math.min(255, Math.floor(b * (1 + factor)));

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // Make chart responsive to container size
    resizeCanvas(canvas) {
        const container = this.template.querySelector('.chart-container');
        if (container) {
            canvas.style.height = `${this.height}px`;
            canvas.height = this.height;
            canvas.width = container.clientWidth;
        }
    }

    handleError(error) {
        this.error = error;
        let errorMessage = 'Unknown error';
        
        if (Array.isArray(error.body)) {
            errorMessage = error.body.map(e => e.message).join(', ');
        } else if (error.body && typeof error.body.message === 'string') {
            errorMessage = error.body.message;
        } else if (typeof error.message === 'string') {
            errorMessage = error.message;
        }
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: errorMessage,
                variant: 'error'
            })
        );
    }

    // Implementation of the refresh function referenced in template
    refreshChart() {
        this.isLoading = true;
        
        // Refresh data by refreshing the wire adapter
        if (this.wiredSummaryResult) {
            refreshApex(this.wiredSummaryResult)
                .catch(error => {
                    this.handleError(error);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        } else {
            // If wire hasn't completed yet
            this.isLoading = false;
        }
    }

    // Handle window resize for responsiveness
    connectedCallback() {
        this.resizeListener = this.handleResize.bind(this);
        window.addEventListener('resize', this.resizeListener);
    }
    
    disconnectedCallback() {
        window.removeEventListener('resize', this.resizeListener);
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
    
    handleResize() {
        if (this.chart) {
            // Debounce resize to avoid performance issues
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                const canvas = this.template.querySelector('canvas.chart');
                if (canvas) {
                    this.resizeCanvas(canvas);
                    this.chart.resize();
                }
            }, 250);
        }
    }

    // Getter to check if we have data to display
    get hasData() {
        return this.chartData && this.chartData.length > 0;
    }
    
    // Getter for no data message
    get noDataMessage() {
        return this.error ? 'Error loading chart data' : 'No project data available';
    }
}