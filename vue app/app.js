var courseApp = new Vue({
    el: '#courses',
    data: {
        courses: [],
        showCourses: true,
        itemsInCart: 0,
        cart: [],
        order: {
            firstName: '',
            lastName: '',
            phoneNumber: ''
        },
        sortingProperty: 'subject',
        sortBy: 'ascending'
    },
    methods: {
        toggleShowCourses() {
            this.showCourses = !this.showCourses;
        },
        addToCartButton(course) {
            var isInCart = false;
            if(this.cart.length > 0) {
                for(var i = 0; i< this.cart.length;i++) {
                    if(this.cart[i].id == course.id) {
                        this.cart[i].numberOrdered += 1;
                        isInCart = true;
                    }
                }
            }
            if(isInCart == false) {
                course.numberOrdered = 1;
                this.cart.push(course);
            }
            course.spaces -= 1;
            this.itemsInCart += 1;
        },
        countSpacesAvailable(course) {
            return course.spaces > 0;
        },
        async placeOrderButton() {
            var tuitionsOrdered = [];
            for(var i = 0; i < this.cart.length;i++) {
                tuitionsOrdered.push({[courseApp.cart[i].id] : courseApp.cart[i].numberOrdered});
            }

            var order = {
                firstName: this.order.firstName,
                lastName: this.order.lastName,
                phoneNumber: this.order.phoneNumber,
                lessons: tuitionsOrdered
            };

            const response = await fetch('http://localhost:3000/placeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });
            const result = await response.json();
            alert(result.message);
        },
        removeCourseFromCart(course){
            const index = this.cart.findIndex(item => item.id == course.id);
            course.spaces += 1;
            this.itemsInCart -= 1;
            this.cart[index].numberOrdered -= 1;
            if(this.cart[index].numberOrdered == 0) {
                this.cart.splice(index, 1);
            }
        },
        sortCourses() {
            var property = this.sortingProperty
            if(this.sortBy == 'ascending') {
                this.courses.sort(function(a,b){
                    if(a[property] < b[property]) { return -1 }
                    if(a[property] > b[property]) { return 1 }
                    return 0
                });
            } else {
                this.courses.sort(function(a,b){
                    if(a[property] > b[property]) { return -1 }
                    if(a[property] < b[property]) { return 1 }
                    return 0
                });
            }
        }
    },
    computed: {
        countItemInCart() {
            return this.cart.length || "";
        },
        validateFormInput() {
            var nameRegEx = /^[a-zA-Z\s-]+$/;
            var numbersOnlyRegex = /^[0-9]+$/;
            if(this.order.firstName === "" || this.order.lastName === "" || this.order.phoneNumber === "") {
                return false;
            }

            if(nameRegEx.test(this.order.firstName) && nameRegEx.test(this.order.lastName) && 
                numbersOnlyRegex.test(this.order.phoneNumber)) {
                return true;
            }
            return false;
        }
    },
    created: async function(){
        const response = await fetch('http://localhost:3000/getCourses/Courses/all');
        this.courses = await response.json();
    }
});
