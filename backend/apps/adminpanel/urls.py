from django.urls import path

from .views import (
    AnalyticsOverviewView,
    ApproveUserView,
    AuditLogListView,
    PendingApprovalsView,
    RejectUserView,
    UserListView,
)

urlpatterns = [
    path("approvals/", PendingApprovalsView.as_view(), name="pending-approvals"),
    path("approvals/<int:user_id>/approve/", ApproveUserView.as_view(), name="approve-user"),
    path("approvals/<int:user_id>/reject/", RejectUserView.as_view(), name="reject-user"),
    path("analytics/overview/", AnalyticsOverviewView.as_view(), name="analytics-overview"),
    path("users/", UserListView.as_view(), name="admin-users"),
    path("audit-log/", AuditLogListView.as_view(), name="audit-log"),
]
