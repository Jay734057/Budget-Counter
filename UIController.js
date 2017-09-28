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
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
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
        },
        
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
            
            var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };
            
            nodeListForEach(fields,function(current,index){
                //do some stuff
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'
                } else {
                    current.textContent = '---'
                }
                
            })
        }
    };
    
})();