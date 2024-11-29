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
        sortBy: 'ascending',
        searchString: ''
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
                tuitionsOrdered.push({
                    lessonId: courseApp.cart[i].id,
                    NumberOrdered: courseApp.cart[i].numberOrdered

                });
            }

            var order = {
                firstName: this.order.firstName,
                lastName: this.order.lastName,
                phoneNumber: this.order.phoneNumber,
                lessons: tuitionsOrdered
            };

            for(var i = 0;i < tuitionsOrdered.length;i++) {
                var query = { id: tuitionsOrdered[i].lessonId };
                query = encodeURIComponent(JSON.stringify(query));
                const tuition = await fetch(`http://localhost:3000/getCourses/Courses/${query}`);
                var result = await tuition.json();
                var space = result[0].spaces - tuitionsOrdered[i].NumberOrdered;
                var requestURL = 'http://localhost:3000/updateDocument/Courses/' + tuitionsOrdered[i].lessonId;
                var responseUpdateSpaces = await fetch(requestURL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({spaces : space})
                });
                const resultUpdateSpaces = await responseUpdateSpaces.json();
                console.log(resultUpdateSpaces);
            }

            const responsePlaceOrder = await fetch('http://localhost:3000/placeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });
            const resultPlaceOrder = await responsePlaceOrder.json();
            alert(resultPlaceOrder.message);
            this.cart = [];
            this.toggleShowCourses();
        },
        removeCourseFromCart(course){
            const index = this.cart.findIndex(item => item.id == course.id);
            course.spaces += 1;
            this.itemsInCart -= 1;
            this.cart[index].numberOrdered -= 1;
            if(this.cart[index].numberOrdered == 0) {
                this.cart.splice(index, 1);
            }
            if(this.cart.length == 0) {
                this.toggleShowCourses();
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
        },
        async search() {
            if(this.searchString == '') {
                var query = {};
                query = encodeURIComponent(JSON.stringify(query));
                const response = await fetch(`http://localhost:3000/getCourses/Courses/${query}`);
                this.courses = await response.json();
            } else {
                const response = await fetch(`http://localhost:3000/search/Courses/${this.searchString}`);
                if(response.ok) {
                    this.courses = await response.json();
                }
            }
        }   
    },
    computed: {
        countItemInCart() {
            return this.cart.length || "";
        },
        validateFormInput() {
            var nameRegEx = /^[a-zA-Z\s-]+$/;
            var numbersOnlyRegex = /^\d{8}$/;
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
        var query = {};
        query = encodeURIComponent(JSON.stringify(query));
        const response = await fetch(`http://localhost:3000/getCourses/Courses/${query}`);
        this.courses = await response.json();
    }
});
