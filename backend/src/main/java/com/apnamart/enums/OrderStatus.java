package com.apnamart.enums;

public enum OrderStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    READY_FOR_PICKUP,
    COMPLETED,
    CANCELLED;

    public boolean canTransitionTo(OrderStatus next) {
        if (this == next) return true;
        return switch (this) {
            case PENDING -> next == ACCEPTED || next == REJECTED || next == CANCELLED;
            case ACCEPTED -> next == READY_FOR_PICKUP || next == CANCELLED;
            case READY_FOR_PICKUP -> next == COMPLETED;
            case REJECTED, COMPLETED, CANCELLED -> false;
        };
    }
}
