class User {
    constructor({ email, first_name, last_name, username, birthday, phone_number, overview, workplace, lives_in, status, allow_likes_notifications, allow_comments_notifications, allow_subscription_notifications }) {
        this.email = email
        this.first_name = first_name
        this.last_name = last_name
        this.username = username
        this.birthday = birthday
        this.phone_number = phone_number
        this.overview = overview
        this.workplace = workplace
        this.lives_in = lives_in
        this.status = status
        this.allow_likes_notifications = allow_likes_notifications
        this.allow_comments_notifications = allow_comments_notifications
        this.allow_subscription_notifications = allow_subscription_notifications
    }
}

module.exports = User