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
            this.cart.push(course.id)
            course.spaces -= 1
        },
        countSpacesAvailable(course) {
            return course.spaces > 0
        },
        placeOrder() {
            alert('order has been placed')
        }
    },
    computed: {
        countItemInCart() {
            return this.cart.length || ""
        },
    }
});
