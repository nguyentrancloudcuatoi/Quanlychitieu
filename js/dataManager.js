// Kiểm tra xem DataManager đã tồn tại chưa
if (typeof window.DataManager === 'undefined') {
    window.DataManager = {
        transactions: {
            getAll: function() {
                const data = localStorage.getItem('transactions');
                console.log('Retrieved transactions:', data);
                return JSON.parse(data) || [];
            },
            add: function(transaction) {
                const transactions = this.getAll();
                transactions.push(transaction);
                localStorage.setItem('transactions', JSON.stringify(transactions));
                this.notifyChange('transactions');
                console.log('Added transaction:', transaction);
            },
            update: function(index, transaction) {
                const transactions = this.getAll();
                transactions[index] = transaction;
                localStorage.setItem('transactions', JSON.stringify(transactions));
                this.notifyChange('transactions');
            },
            delete: function(index) {
                const transactions = this.getAll();
                transactions.splice(index, 1);
                localStorage.setItem('transactions', JSON.stringify(transactions));
                this.notifyChange('transactions');
            }
        },

        budgets: {
            getAll: function() {
                const data = localStorage.getItem('budgets');
                console.log('Retrieved budgets:', data);
                return JSON.parse(data) || [];
            },
            add: function(budget) {
                const budgets = this.getAll();
                budgets.push(budget);
                localStorage.setItem('budgets', JSON.stringify(budgets));
                this.notifyChange('budgets');
            },
            update: function(index, budget) {
                const budgets = this.getAll();
                budgets[index] = budget;
                localStorage.setItem('budgets', JSON.stringify(budgets));
                this.notifyChange('budgets');
            },
            delete: function(index) {
                const budgets = this.getAll();
                budgets.splice(index, 1);
                localStorage.setItem('budgets', JSON.stringify(budgets));
                this.notifyChange('budgets');
            }
        },

        categories: {
            list: [
                { id: 'food', name: 'Ăn uống', icon: 'utensils' },
                { id: 'transport', name: 'Di chuyển', icon: 'car' },
                { id: 'shopping', name: 'Mua sắm', icon: 'shopping-cart' },
                { id: 'bills', name: 'Hóa đơn', icon: 'file-invoice-dollar' },
                { id: 'entertainment', name: 'Giải trí', icon: 'film' },
                { id: 'other', name: 'Khác', icon: 'ellipsis-h' }
            ],
            getName: function(categoryId) {
                const categories = {
                    'food': 'Ăn uống',
                    'transport': 'Di chuyển', 
                    'shopping': 'Mua sắm',
                    'bills': 'Hóa đơn',
                    'entertainment': 'Giải trí',
                    'salary': 'Lương',
                    'investment': 'Đầu tư',
                    'other': 'Khác'
                };
                return categories[categoryId] || categoryId;
            },
            
            getIcon: function(categoryId) {
                const icons = {
                    'food': 'utensils',
                    'transport': 'car',
                    'shopping': 'shopping-cart', 
                    'bills': 'file-invoice',
                    'entertainment': 'film',
                    'salary': 'money-bill',
                    'investment': 'chart-line',
                    'other': 'ellipsis-h'
                };
                return icons[categoryId] || 'question';
            }
        },

        calculations: {
            getIncomeInPeriod: function(startDate, endDate) {
                const transactions = DataManager.transactions.getAll();
                return transactions
                    .filter(t => t.type === 'income' && 
                               t.date >= startDate && 
                               t.date <= endDate)
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            },

            getExpenseInPeriod: function(startDate, endDate) {
                const transactions = DataManager.transactions.getAll();
                return transactions
                    .filter(t => t.type === 'expense' && 
                               t.date >= startDate && 
                               t.date <= endDate)
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            },

            getCategoryExpenses: function(month) {
                const transactions = DataManager.transactions.getAll();
                const expenses = {};
                
                transactions
                    .filter(t => t.type === 'expense' && t.date.startsWith(month))
                    .forEach(t => {
                        if (!expenses[t.category]) {
                            expenses[t.category] = 0;
                        }
                        expenses[t.category] += parseFloat(t.amount);
                    });
                
                return expenses;
            }
        },

        validateData: function() {
            const transactions = this.transactions.getAll();
            const budgets = this.budgets.getAll();
            
            console.log('Current transactions:', transactions);
            console.log('Current budgets:', budgets);
            
            return {
                hasTransactions: transactions.length > 0,
                hasBudgets: budgets.length > 0
            };
        },

        notifyChange: function(type) {
            window.dispatchEvent(new CustomEvent('dataChanged', {
                detail: { type: type }
            }));
        },

        debug: function() {
            console.log('Current localStorage state:');
            console.log('Transactions:', this.transactions.getAll());
            console.log('Budgets:', this.budgets.getAll());
        }
    };
}

// Thêm event listener để theo dõi thay đổi localStorage
window.addEventListener('storage', (e) => {
    console.log('Storage changed:', e.key, e.newValue);
    if (e.key === 'transactions' || e.key === 'budgets') {
        window.dispatchEvent(new CustomEvent('dataChanged'));
    }
});