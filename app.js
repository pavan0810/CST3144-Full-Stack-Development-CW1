new Vue({
    el: '#courses',
    data: {
        courses: courses,
        showCourses: true
    },
    methods: {
        toggleShowCourses() {
            this.showCourses = !this.showCourses
        }
    },
    computed: {

    }
});