import { LightningElement, api, wire } from 'lwc';
import getLoyaltyPoints from '@salesforce/apex/LoyaltyPointsController.getLoyaltyPoints';
import addLoyaltyPoints from '@salesforce/apex/LoyaltyPointsController.addLoyaltyPoints';
import resetLoyaltyPoints from '@salesforce/apex/LoyaltyPointsController.resetLoyaltyPoints';

export default class LoyaltyPoints extends LightningElement {
    @api recordId;
    loyaltyPoints = 0;

    connectedCallback() {
        this.loadPoints();
    }

    loadPoints() {
        getLoyaltyPoints({ accountId: this.recordId })
            .then(result => {
                this.loyaltyPoints = result;
            })
            .catch(error => {
                console.error('Error loading points:', error);
            });
    }

    handleAdd() {
        addLoyaltyPoints({ accountId: this.recordId, pointsToAdd: 10 })
            .then(result => {
                this.loyaltyPoints = result;
            })
            .catch(error => {
                console.error('Error adding points:', error);
            });
    }

    handleReset() {
        resetLoyaltyPoints({ accountId: this.recordId })
            .then(() => {
                this.loyaltyPoints = 0;
            })
            .catch(error => {
                console.error('Error resetting points:', error);
            });
    }
}