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
        }
    },
    methods: {
        toggleShowCourses() {
            this.showCourses = !this.showCourses
        },
        addToCart(course) {
            this.cart.push(course)
            course.spaces -= 1
        },
        countSpacesAvailable(course) {
            return course.spaces > 0
        },
        placeOrder() {
            alert('order has been placed')
        },
        removeCourse(){

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
