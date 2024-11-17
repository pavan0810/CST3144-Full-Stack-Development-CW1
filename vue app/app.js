var courseApp = new Vue({
    el: '#courses',
    data: {
        courses: courses,
        showCourses: true,
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
            this.showCourses = !this.showCourses
        },
        addToCartButton(course) {
            this.cart.push(course)
            course.spaces -= 1
        },
        countSpacesAvailable(course) {
            return course.spaces > 0
        },
        placeOrderButton() {
            alert('order has been placed')
        },
        removeCourseFromCart(course){
            const index = this.cart.findIndex(item => item.id == course.id)
            course.spaces += 1
            this.cart.splice(index, 1)
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
            return this.cart.length || ""
        },
        validateFormInput() {
            var nameRegEx = /^[a-zA-Z\s-]+$/
            var numbersOnlyRegex = /^[0-9]+$/
            if(this.order.firstName === "" || this.order.lastName === "" || this.order.phoneNumber === "") {
                return false
            }

            if(nameRegEx.test(this.order.firstName) && nameRegEx.test(this.order.lastName) && 
                numbersOnlyRegex.test(this.order.phoneNumber)) {
                return true
            }
            return false
        }
    }
});
