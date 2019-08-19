import moment from 'moment'
import './dailytimetable.html'

Template.dailytimetable.onCreated(function dailytimetablecreated() {
  this.dailyTimecards = new ReactiveVar([])
  Tracker.autorun(() => {
    if (this.data.project.get()
      && this.data.resource.get()
      && this.data.period.get()
      && this.data.limit.get()
      && this.data.customer.get()) {
      Meteor.call('getDailyTimecards',
        {
          projectId: this.data.project.get(),
          userId: this.data.resource.get(),
          period: this.data.period.get(),
          limit: this.data.limit.get(),
          customer: this.data.customer.get(),
        }, (error, result) => {
          if (error) {
            console.error(error)
          } else {
            this.dailyTimecards.set(result)
          }
        })
    }
  })
})
Template.dailytimetable.helpers({
  dailyTimecards() {
    return Template.instance().dailyTimecards.get()
  },
  userTimeUnit() {
    if (!Meteor.loggingIn() && Meteor.user() && Meteor.user().profile) {
      return Meteor.user().profile.timeunit === 'd' ? 'Days' : 'Hours'
    }
    return false
  },
  moment(date) {
    return moment(date).format('ddd DD.MM.YYYY')
  },
  dailySum() {
    return Template.instance().dailyTimecards.get()
      .reduce(((total, element) => total + element.totalHours), 0)
  },
})