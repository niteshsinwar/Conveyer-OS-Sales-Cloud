public class PayloadGenerator {
    public static PayloadWrapper generatePayload(String accountId, String accessToken) {
        PayloadWrapper payload = new PayloadWrapper();
        
        // Query Account
        Account acc = [SELECT Id, Name FROM Account WHERE Id = :accountId LIMIT 1];
        
        if (acc != null) {
            // Set Account data
            payload.accountId = acc.Id;
            payload.accountName = acc.Name;
            
            // Query Contacts related to Account
            Map<Id, Contact> contactMap = new Map<Id, Contact>();
            for (Contact con : [SELECT Id, Name, AccountId FROM Contact WHERE AccountId = :accountId]) {
                contactMap.put(con.Id, con);
            }
            
            // Query Opportunities related to Contacts
            Map<Id, List<Opportunity>> oppMap = new Map<Id, List<Opportunity>>();
            for (Opportunity opp : [SELECT Id, Name, ContactId FROM Opportunity WHERE ContactId IN :contactMap.keySet()]) {
                if (!oppMap.containsKey(opp.ContactId)) {
                    oppMap.put(opp.ContactId, new List<Opportunity>());
                }
                oppMap.get(opp.ContactId).add(opp);
            }
            
            // Set Contact and Opportunity data
            for (Id contactId : contactMap.keySet()) {
                Contact con = contactMap.get(contactId);
                ContactData contactData = new ContactData();
                contactData.contactName = con.Name;
                
                if (oppMap.containsKey(contactId)) {
                    for (Opportunity opp : oppMap.get(contactId)) {
                        OpportunityData oppData = new OpportunityData();
                        oppData.opportunityId = opp.Id;
                        oppData.opportunityName = opp.Name;
                        contactData.opportunities.add(oppData);
                    }
                }
                
                payload.contacts.add(contactData);
            }
            
            return payload;
        } else {
            return null; // Account not found
        }
    }
    // This class would typically be named (e.g., TestDataFactory.cls)
// public class TestDataFactory {

    // Helper method to get the current quarter from a date
    private static Integer getQuarter(Date d) {
        Integer month = d.month();
        if (month >= 1 && month <= 3) return 1;
        if (month >= 4 && month <= 6) return 2;
        if (month >= 7 && month <= 9) return 3;
        return 4; // month >= 10 && month <= 12
    }

    // Static method to generate test data for charting use cases
    public static void createData(){
        // --- Test Data Generation Method Start ---

        // --- Test Data Configuration ---
        Integer numberOfRecordsToCreate = 20; // Number of records to create for general scenarios
        Integer numberOfAccountsForIndustry = 5; // Number of accounts per industry
        Integer numberOfCasesPerPriority = 7; // Number of cases per priority
        Integer numberOfOppsPerWeekThisQuarter = 2; // Number of opportunities per week for the current quarter trend

        System.debug('Starting test data generation method...');

        List<SObject> recordsToInsert = new List<SObject>();

        // --- Use Case 1: Open Cases by Priority ---
        // Relevant Fields: Status (not 'Closed'), Priority
        System.debug('Generating data for Use Case 1: Open Cases by Priority');
        String[] casePriorities = new String[]{'High', 'Medium', 'Low'};
        String[] openCaseStatuses = new String[]{'New', 'Working', 'Escalated', 'On Hold'}; // Ensure these are valid Status picklist values in your org

        for (String priority : casePriorities) {
            for (Integer i = 0; i < numberOfCasesPerPriority; i++) {
                Case newCase = new Case(
                    Priority = priority,
                    Status = openCaseStatuses[Math.mod(i, openCaseStatuses.size())], // Cycle through open statuses
                    Subject = 'Test Case - Priority ' + priority + ' #' + (i + 1),
                    Description = 'This is a test case generated for charting.'
                );
                recordsToInsert.add(newCase);
            }
        }
        System.debug('Added ' + (casePriorities.size() * numberOfCasesPerPriority) + ' Case records for insertion.');

        // --- Use Case 2: Accounts by Industry ---
        // Relevant Fields: Industry
        System.debug('Generating data for Use Case 2: Accounts by Industry');
        String[] accountIndustries = new String[]{
            'Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing',
            'Consulting', 'Education', 'Energy', 'Media', 'Telecommunications'
        }; // Add more or adjust as per your org's picklist values

        Integer accountCounterForIndustry = 0;
        for (String industry : accountIndustries) {
            for (Integer i = 0; i < numberOfAccountsForIndustry; i++) {
                Account newAccount = new Account(
                    Name = 'Test Account ' + industry + ' #' + (i + 1),
                    Industry = industry,
                    AnnualRevenue = Math.random() * 5000000 + 100000, // Random revenue
                    NumberOfEmployees = (Integer)(Math.random() * 1000 + 10) // Random employee count
                );
                recordsToInsert.add(newAccount);
                accountCounterForIndustry++;
            }
        }
        System.debug('Added ' + accountCounterForIndustry + ' Account records for industry breakdown.');


        // --- Use Case 3: Trend of total expected revenue from opportunities closing this quarter, week by week ---
        // Relevant Fields: ExpectedRevenue (calculated), Amount, Probability, CloseDate (this quarter, weekly), StageName
        System.debug('Generating data for Use Case 3: Opportunity Revenue Trend This Quarter');

        Date today = Date.today();
        // Calculate start of the current quarter
        Integer currentMonth = today.month();
        Integer quarterStartMonth;
        if (currentMonth >= 1 && currentMonth <= 3) { // Q1: Jan, Feb, Mar
            quarterStartMonth = 1;
        } else if (currentMonth >= 4 && currentMonth <= 6) { // Q2: Apr, May, Jun
            quarterStartMonth = 4;
        } else if (currentMonth >= 7 && currentMonth <= 9) { // Q3: Jul, Aug, Sep
            quarterStartMonth = 7;
        } else { // Q4: Oct, Nov, Dec
            quarterStartMonth = 10;
        }
        Date quarterStartDate = Date.newInstance(today.year(), quarterStartMonth, 1);
        Date quarterEndDate = quarterStartDate.addMonths(3).addDays(-1); // End of the quarter

        List<Opportunity> opportunitiesForTrend = new List<Opportunity>();
        String[] oppStages = new String[]{ // Common open stages
            'Prospecting', 'Qualification', 'Needs Analysis', 
            'Value Proposition', 'Proposal/Price Quote', 'Negotiation/Review'
        };

        // Create a dummy account for these opportunities.
        Account dummyAccountForOpps = new Account(Name='Trend Opps Account');
        recordsToInsert.add(dummyAccountForOpps); 


        Date currentDateInQuarter = quarterStartDate;
        Integer weekCounter = 1;
        Integer currentQuarter = getQuarter(today); // Get current quarter using helper

        while(currentDateInQuarter <= quarterEndDate) {
            for (Integer i = 0; i < numberOfOppsPerWeekThisQuarter; i++) {
                Opportunity newOpp = new Opportunity(
                    Name = 'Test Opp Q' + currentQuarter + ' Week ' + weekCounter + ' #' + (i + 1),
                    // AccountId will be set after dummyAccountForOpps is inserted
                    StageName = oppStages[Math.mod(i, oppStages.size())], 
                    CloseDate = currentDateInQuarter.addDays(Math.mod(i, 7)), 
                    Amount = Math.random() * 150000 + 5000, 
                    // ExpectedRevenue removed as it's typically a formula field
                    Probability = (Math.random() * 80 + 10) 
                );
                opportunitiesForTrend.add(newOpp);
            }
            currentDateInQuarter = currentDateInQuarter.addDays(7); 
            weekCounter++;
        }
        System.debug('Generated ' + opportunitiesForTrend.size() + ' Opportunity records for quarterly trend. AccountId will be assigned post-insert.');


        // --- Use Case 4: Opportunity amounts distribution ---
        // Relevant Fields: Amount
        System.debug('Generating data for Use Case 4: Opportunity Amounts Distribution');
        List<Opportunity> opportunitiesForDistribution = new List<Opportunity>();
        Account dummyAccountForDistOpps = new Account(Name='Distribution Opps Account');
        recordsToInsert.add(dummyAccountForDistOpps); 

        for (Integer i = 0; i < numberOfRecordsToCreate; i++) {
            Double baseAmount;
            if (Math.random() < 0.3) { 
                baseAmount = Math.random() * 20000 + 1000; 
            } else if (Math.random() < 0.7) { 
                baseAmount = Math.random() * 80000 + 20000; 
            } else { 
                baseAmount = Math.random() * 400000 + 100000; 
            }
            Opportunity newOpp = new Opportunity(
                Name = 'Distribution Opp #' + (i + 1),
                // AccountId will be set after dummyAccountForDistOpps is inserted
                StageName = oppStages[Math.mod(i, oppStages.size())],
                CloseDate = Date.today().addMonths((Integer)(Math.random() * 6) - 3), 
                Amount = baseAmount,
                Probability = (Math.random() * 70 + 20) // Assign a probability for ExpectedRevenue calculation
                // ExpectedRevenue removed as it's typically a formula field
            );
            opportunitiesForDistribution.add(newOpp);
        }
        System.debug('Generated ' + opportunitiesForDistribution.size() + ' Opportunity records for amount distribution. AccountId will be assigned post-insert.');


        // --- Use Case 5: Connection between annual revenue and number of employees for accounts ---
        // Relevant Fields: AnnualRevenue, NumberOfEmployees
        System.debug('Generating data for Use Case 5: Account Revenue vs. Employees');
        List<Account> accountsForScatter = new List<Account>();
        for (Integer i = 0; i < numberOfRecordsToCreate + 10; i++) { 
            Integer employees = (Integer)(Math.random() * 2000 + 20); 
            Double revenue;
            Double randomFactor = (Math.random() * 0.8 + 0.6); 

            if (Math.random() < 0.6) { 
                 revenue = employees * (Math.random() * 5000 + 1000) * randomFactor; 
            } else { 
                 revenue = (Math.random() * 10000000 + 50000) * randomFactor;
            }
            revenue = Math.max(50000, Math.min(revenue, 200000000)); 

            Account newAccount = new Account(
                Name = 'Scatter Test Account #' + (i + 1),
                AnnualRevenue = revenue,
                NumberOfEmployees = employees,
                Industry = accountIndustries[Math.mod(i, accountIndustries.size())] 
            );
            accountsForScatter.add(newAccount);
        }
        recordsToInsert.addAll(accountsForScatter);
        System.debug('Added ' + accountsForScatter.size() + ' Account records for revenue vs. employees scatter plot.');


        // --- Perform DML Operation ---
        List<Opportunity> oppsToUpdate = new List<Opportunity>();

        if (!recordsToInsert.isEmpty()) {
            try {
                Database.SaveResult[] srList = Database.insert(recordsToInsert, false); 

                Id trendAccountId = null; // Initialize to null
                Id distAccountId = null;  // Initialize to null

                // Iterate through the results to find the IDs of successfully inserted dummy accounts
                for (Integer j = 0; j < srList.size(); j++) {
                    if (srList[j].isSuccess()) {
                        // Check if the current SObject in recordsToInsert (at index j) is one of the dummy accounts
                        SObject currentRecord = recordsToInsert.get(j);
                        if (currentRecord instanceof Account) {
                            Account acc = (Account)currentRecord;
                            if (acc.Name == 'Trend Opps Account') {
                                trendAccountId = srList[j].getId();
                            } else if (acc.Name == 'Distribution Opps Account') {
                                distAccountId = srList[j].getId();
                            }
                        }
                    } else {
                        // Log error for failed initial inserts
                        SObject failedRecord = recordsToInsert.get(j);
                        String recordName = 'Unknown Record';
                        if (failedRecord instanceof Account) recordName = ((Account)failedRecord).Name;
                        else if (failedRecord instanceof Case) recordName = ((Case)failedRecord).Subject;
                        // Add more types if necessary

                        for(Database.Error err : srList[j].getErrors()) {
                            System.debug('Error inserting initial record (' + recordName + '): ' + err.getStatusCode() + ': ' + err.getMessage() + ' Fields: ' + err.getFields());
                        }
                    }
                }
                
                if(trendAccountId != null){
                    for(Opportunity opp : opportunitiesForTrend){
                        opp.AccountId = trendAccountId;
                    }
                    oppsToUpdate.addAll(opportunitiesForTrend);
                } else {
                    System.debug('Warning: Trend Opps Account was not inserted or its Id could not be retrieved. Trend opportunities will not have an AccountId.');
                }

                if(distAccountId != null){
                    for(Opportunity opp : opportunitiesForDistribution){
                        opp.AccountId = distAccountId;
                    }
                    oppsToUpdate.addAll(opportunitiesForDistribution);
                } else {
                    System.debug('Warning: Distribution Opps Account was not inserted or its Id could not be retrieved. Distribution opportunities will not have an AccountId.');
                }
                
                if(!oppsToUpdate.isEmpty()){
                    Database.SaveResult[] updateSrList = Database.update(oppsToUpdate, false);
                    Integer successfulUpdates = 0;
                    for(Integer k=0; k < updateSrList.size(); k++){
                        if(updateSrList[k].isSuccess()){
                            successfulUpdates++;
                        } else {
                             // Log error for failed Opportunity updates
                             Opportunity failedOpp = oppsToUpdate.get(k);
                             for(Database.Error err : updateSrList[k].getErrors()) {
                                System.debug('Error updating Opportunity ('+ failedOpp.Name +'): ' + err.getStatusCode() + ': ' + err.getMessage() + ' Fields: ' + err.getFields());
                            }
                        }
                    }
                    System.debug('Successfully updated ' + successfulUpdates + ' of ' + oppsToUpdate.size() + ' Opportunity records with AccountIds.');
                }

                Integer successfulInitialInserts = 0;
                for (Database.SaveResult sr : srList) {
                    if (sr.isSuccess()) {
                        successfulInitialInserts++;
                    }
                }
                System.debug('Successfully processed ' + successfulInitialInserts + ' initial records for insertion (Cases, Accounts, including dummy Accounts).');
                
                Integer nonDummySuccessfullyInserted = 0;
                Integer successfullyUpdatedOppsCount = 0;

                for (Integer j=0; j < srList.size(); j++) {
                    if (srList[j].isSuccess()) {
                        SObject rec = recordsToInsert.get(j);
                        // Count only non-dummy accounts and cases as "data records" from the initial insert
                        if (!((rec instanceof Account) && (((Account)rec).Name == 'Trend Opps Account' || ((Account)rec).Name == 'Distribution Opps Account'))) {
                            nonDummySuccessfullyInserted++;
                        }
                    }
                }

                if(!oppsToUpdate.isEmpty()){
                     for(Database.SaveResult sr : Database.update(oppsToUpdate, false)){ // Re-check success for counting
                        if(sr.isSuccess()) successfullyUpdatedOppsCount++;
                    }
                }

                Integer totalDataRecordsCreated = nonDummySuccessfullyInserted + successfullyUpdatedOppsCount;
                System.debug('Total data records successfully created/updated: ' + totalDataRecordsCreated + ' (Cases, non-dummy Accounts, and Opportunities).');


                // Query back some data to verify (optional)
                List<Account> insertedAccounts = [SELECT Id, Name, Industry, AnnualRevenue, NumberOfEmployees FROM Account WHERE Name LIKE 'Test Account %' OR Name LIKE 'Scatter Test Account %' OR Name = 'Trend Opps Account' OR Name = 'Distribution Opps Account' ORDER BY CreatedDate DESC LIMIT 10];
                System.debug('Sample inserted accounts: ' + insertedAccounts);
                List<Case> insertedCases = [SELECT Id, Subject, Priority, Status FROM Case WHERE Subject LIKE 'Test Case - Priority %' ORDER BY CreatedDate DESC LIMIT 5];
                System.debug('Sample inserted cases: ' + insertedCases);
                List<Opportunity> insertedOpps = [SELECT Id, Name, AccountId, StageName, Amount, CloseDate, ExpectedRevenue, Probability FROM Opportunity WHERE Name LIKE 'Test Opp Q%' OR Name LIKE 'Distribution Opp %' ORDER BY CreatedDate DESC LIMIT 10];
                System.debug('Sample inserted opportunities: ' + insertedOpps);

            } catch (DmlException e) {
                System.debug('DML Exception during test data generation: ' + e.getMessage());
                for (Integer i = 0; i < e.getNumDml(); i++) {
                    System.debug('DML Error on operation ' + i + ': ' + e.getDmlMessage(i));
                }
            }
        } else {
            System.debug('No records were generated for insertion.');
        }

        System.debug('Test data generation method finished.');
    }
// } // End of class declaration

    public class PayloadWrapper {
        public String accountId;
        public String accountName;
        public List<ContactData> contacts;

        public PayloadWrapper() {
            contacts = new List<ContactData>();
        }
    }

    public class ContactData {
        public String contactName;
        public List<OpportunityData> opportunities;

        public ContactData() {
            opportunities = new List<OpportunityData>();
        }
    }

    public class OpportunityData {
        public String opportunityId;
        public String opportunityName;

        public OpportunityData() {
        }
    }
}