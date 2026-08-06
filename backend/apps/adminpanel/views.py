from django.db.models import Sum
from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import HotelProfile, LabProfile, SupplierProfile, User
from apps.core.permissions import IsAdmin
from apps.labs.models import Certificate, VerificationRequest
from apps.notifications.models import Notification
from apps.orders.models import Order
from apps.suppliers.models import Batch, LedgerEntry

from .models import AuditLog
from .serializers import AuditLogSerializer, PendingUserSerializer


class PendingApprovalsView(generics.ListAPIView):
    serializer_class = PendingUserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return User.objects.filter(
            role__in=[User.Role.SUPPLIER, User.Role.LAB],
            approval_status=User.ApprovalStatus.PENDING,
        ).order_by("date_joined")


class ApproveUserView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, user_id):
        user = User.objects.get(id=user_id)
        user.approval_status = User.ApprovalStatus.APPROVED
        user.save(update_fields=["approval_status"])
        if hasattr(user, "supplier_profile"):
            user.supplier_profile.approved_at = timezone.now()
            user.supplier_profile.approved_by = request.user
            user.supplier_profile.save(update_fields=["approved_at", "approved_by"])
        if hasattr(user, "lab_profile"):
            user.lab_profile.approved_at = timezone.now()
            user.lab_profile.approved_by = request.user
            user.lab_profile.save(update_fields=["approved_at", "approved_by"])
        AuditLog.objects.create(actor=request.user, action="approve_user", target_type="User", target_id=str(user.id))
        Notification.objects.create(
            recipient=user,
            notif_type=Notification.NotifType.ACCOUNT_APPROVAL,
            title="Your account has been approved",
            body="You can now transact on JPureva.",
        )
        return Response(PendingUserSerializer(user).data)


class RejectUserView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, user_id):
        user = User.objects.get(id=user_id)
        user.approval_status = User.ApprovalStatus.REJECTED
        user.save(update_fields=["approval_status"])
        AuditLog.objects.create(actor=request.user, action="reject_user", target_type="User", target_id=str(user.id))
        Notification.objects.create(
            recipient=user,
            notif_type=Notification.NotifType.ACCOUNT_APPROVAL,
            title="Your account application was rejected",
            body="Please contact support for details.",
        )
        return Response(PendingUserSerializer(user).data)


class AnalyticsOverviewView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        pending_ledger = LedgerEntry.objects.filter(status=LedgerEntry.Status.PENDING).aggregate(
            total=Sum("amount")
        )["total"]
        return Response({
            "suppliers_total": SupplierProfile.objects.count(),
            "labs_total": LabProfile.objects.count(),
            "hotels_total": HotelProfile.objects.count(),
            "pending_approvals": User.objects.filter(
                role__in=[User.Role.SUPPLIER, User.Role.LAB],
                approval_status=User.ApprovalStatus.PENDING,
            ).count(),
            "batches_total": Batch.objects.count(),
            "batches_listed": Batch.objects.filter(status=Batch.Status.LISTED).count(),
            "verification_requests_pending": VerificationRequest.objects.filter(
                status__in=[VerificationRequest.Status.REQUESTED, VerificationRequest.Status.IN_PROGRESS]
            ).count(),
            "certificates_issued": Certificate.objects.count(),
            "orders_total": Order.objects.count(),
            "ledger_pending_amount": str(pending_ledger or 0),
        })


class UserListView(generics.ListAPIView):
    serializer_class = PendingUserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = User.objects.all().order_by("-date_joined")
        role = self.request.query_params.get("role")
        status_param = self.request.query_params.get("status")
        if role:
            qs = qs.filter(role=role)
        if status_param:
            qs = qs.filter(approval_status=status_param)
        return qs


class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]
    queryset = AuditLog.objects.all()
