// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });  
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput(); 
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem,input.type);
            // 4. Clear the fields
            UICtrl.clearFields();
            // 5. Calculate and update budget
            updateBudget();
            // 6. update percentage
            updatePercentages();
        }
        
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 
        
        if (itemID) {
            var splitID = itemID.split('-');
            
            //delete item from data
            budgetCtrl.deleteItem(splitID[0],parseInt(splitID[1]));
            //delete item from UI
            UICtrl.deleteListItem(itemID);
            //update budget
            updateBudget();
            //update percentage
            updatePercentages();
        }
    }
    
    var updateBudget = function() {
        //get budget
        budgetCtrl.calculateBudget();
        
        var budget = budgetCtrl.getBudget();
        
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function() {
        //1. calculate
        budgetCtrl.calculatePercentages();
        //2. read from budget controller
        var percentages = budgetCtrl.getPercentages();
        //3. update UI
        UICtrl.displayPercentages(percentages);
    }
    
    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            })
            UICtrl.displayMonth();
        }
    };
    
})(budgetController, UIController);


controller.init();