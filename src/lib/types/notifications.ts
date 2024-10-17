export type NotificationState = {
    show: boolean
    message: string
}

export type AllNotificationsStates = {
    submited: NotificationState
    error: NotificationState
    success: NotificationState
}
