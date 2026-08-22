"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutomationFlows = getAutomationFlows;
function getAutomationFlows() {
    return {
        reminders: [
            { id: "rem_1", type: "decorator", message: "Follow up with the client 24 hours before the scheduled job.", status: "active" },
            { id: "rem_2", type: "client", message: "Send a prep checklist the day before painting starts.", status: "active" }
        ],
        followUps: [
            { id: "fu_1", type: "client", message: "Ask for a review after job completion.", status: "queued" }
        ],
        quoteDrafts: [
            { id: "qd_1", template: "Kitchen refresh", status: "draft" }
        ],
        bookingConfirmations: [
            { id: "bc_1", message: "Booking confirmed for Tuesday, 9:00 AM.", status: "sent" }
        ]
    };
}
