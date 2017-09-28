// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calculatePercentage = function(totalExp) {
        if (totalExp > 0)  {
            this.percentage = Math.round(this.value / totalExp * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    
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
        
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current){
                current.calculatePercentage(data.totals.exp);
            }) 
        },
        
        getBudget: function() {
          return {
              budget: data.budget,
              totalIncome: data.totals.inc,
              totalExpenses: data.totals.exp,
              percentage: data.percentage
          }  
        },
        
        getPercentages: function() {
            return data.allItems.exp.map(function(current){
                return current.getPercentage();
            })
        },
        
        test: function() {
            console.log(data)
        }
    }
})();