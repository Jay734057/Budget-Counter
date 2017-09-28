// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value
        });
        
        data.totals[type] = sum;
    };
    
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    var findID = function(obj, id) {
        return obj.id === id
    }
    
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            // inc/exp
            if (type === 'exp') {
                newItem = new Expense(Date.now(), des, val);
            } else if (type === 'inc') {
                newItem = new Income(Date.now(), des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            console.log(data);
            // Return the new element
            return newItem;
        },  
        
        deleteItem: function(type, id) {
            console.log(id + ' is deleted');
            data.allItems[type] = data.allItems[type].filter(function(obj) {
                return obj.id !== id
            })
            
            //another method:
//            var ids = data.allItems[type].map(function (current) {
//                return current.id;
//            })
//            
//            var index = ids.indexOf(id);
//            
//            if (index !== -1) {
//                data.allItems[type].splice(index, 1);
//            }
        },
        
        calculateBudget: function() {
            //total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            //budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp;
            //calculate percentage of expense
            if (data.totals.inc > 0){
              data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);  
            } else {
                data.percentage = -1;
            }
            
        },
        
        getBudget: function() {
          return {
              budget: data.budget,
              totalIncome: data.totals.inc,
              totalExpenses: data.totals.exp,
              percentage: data.percentage
          }  
        },
        
        test: function() {
            console.log(data)
        }
    }
})();




// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };
    
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        },
        
        addListItem: function(obj, type) {
            // 1.create html string with placeholder text
            var html, element;
            
            if (type === 'inc'){
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // 2.replace the placeholder text with actual data
            html = html.replace('%id%', obj.id);
            html = html.replace('%description%', obj.description);
            html = html.replace('%value%', obj.value);
            // 3.insert html into the DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        
        deleteListItem: function(itemID){
            var item = document.getElementById(itemID);
            item.parentNode.removeChild(item);
        },
        
        clearFields: function() {
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            var fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExpenses;
            
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        }
    };
    
})();




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
        }
    }
    
    var updateBudget = function() {
        //get budget
        budgetCtrl.calculateBudget();
        
        var budget = budgetCtrl.getBudget();
        
        UICtrl.displayBudget(budget);
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
        }
    };
    
})(budgetController, UIController);


controller.init();