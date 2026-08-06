from django.core.management.base import BaseCommand

from apps.accounts.models import HotelProfile, LabProfile, SupplierProfile, User
from apps.catalog.models import Category, Ingredient
from apps.hotels.models import SubscriptionPlan
from apps.labs.models import TestType


class Command(BaseCommand):
    help = "Seed demo catalog data, test types, subscription plans, and one demo user per role."

    def handle(self, *args, **options):
        self._seed_catalog()
        self._seed_test_types()
        self._seed_subscription_plans()
        self._seed_demo_users()
        self.stdout.write(self.style.SUCCESS("Demo data seeded."))

    def _seed_catalog(self):
        data = {
            "Dairy": [("A2 Cow Milk", "litre", 1, 2), ("Paneer", "kg", 1, 3), ("Curd", "kg", 1, 2)],
            "Vegetables": [("Tomato", "kg", 60, 90), ("Spinach", "kg", 30, 45), ("Potato", "kg", 70, 120)],
            "Spices": [("Turmeric", "kg", 210, 270), ("Red Chilli", "kg", 150, 180)],
            "Meat": [("Chicken", "kg", 35, 45), ("Mutton", "kg", 180, 365)],
        }
        icons = {"Dairy": "leaf", "Vegetables": "leaf", "Spices": "leaf", "Meat": "truck"}
        for cat_name, ingredients in data.items():
            category, _ = Category.objects.get_or_create(name=cat_name, defaults={"icon": icons[cat_name]})
            for name, unit, min_days, max_days in ingredients:
                Ingredient.objects.get_or_create(
                    category=category,
                    name=name,
                    defaults={
                        "unit_default": unit,
                        "expected_min_harvest_days": min_days,
                        "expected_max_harvest_days": max_days,
                    },
                )

    def _seed_test_types(self):
        for name, desc in [
            ("Adulteration", "Tests for common adulterants"),
            ("Heavy Metals", "Lead, mercury, arsenic, cadmium screening"),
            ("Microbiological", "Bacterial/fungal contamination screening"),
        ]:
            TestType.objects.get_or_create(name=name, defaults={"description": desc})

    def _seed_subscription_plans(self):
        plans = [
            ("BASIC", 999, 9999, {"max_trust_badges": 1, "priority_support": False, "api_access": False}),
            ("PROFESSIONAL", 2999, 29999, {"max_trust_badges": 3, "priority_support": True, "api_access": False}),
            ("ENTERPRISE", 7999, 79999, {"max_trust_badges": 10, "priority_support": True, "api_access": True}),
        ]
        for name, monthly, annual, features in plans:
            SubscriptionPlan.objects.get_or_create(
                name=name,
                defaults={"price_monthly": monthly, "price_annual": annual, "features": features},
            )

    def _seed_demo_users(self):
        if not User.objects.filter(email="admin@jpureva.com").exists():
            admin = User.objects.create_superuser(
                username="admin@jpureva.com", email="admin@jpureva.com", password="adminpass123"
            )
            admin.role = User.Role.ADMIN
            admin.approval_status = User.ApprovalStatus.APPROVED
            admin.save()

        if not User.objects.filter(email="demo.supplier@jpureva.com").exists():
            u = User.objects.create_user(
                username="demo.supplier@jpureva.com", email="demo.supplier@jpureva.com",
                password="demopass123", role=User.Role.SUPPLIER,
                approval_status=User.ApprovalStatus.APPROVED,
            )
            SupplierProfile.objects.create(
                user=u, fpo_name="Nashik Farmers Producer Org",
                fssai_license_number="FSSAI-DEMO-001", state="Maharashtra", district="Nashik",
            )

        if not User.objects.filter(email="demo.lab@jpureva.com").exists():
            u = User.objects.create_user(
                username="demo.lab@jpureva.com", email="demo.lab@jpureva.com",
                password="demopass123", role=User.Role.LAB,
                approval_status=User.ApprovalStatus.APPROVED,
            )
            LabProfile.objects.create(
                user=u, lab_name="FoodSafe Testing Labs", nabl_accreditation_number="NABL-T-DEMO-001",
            )

        if not User.objects.filter(email="demo.hotel@jpureva.com").exists():
            u = User.objects.create_user(
                username="demo.hotel@jpureva.com", email="demo.hotel@jpureva.com",
                password="demopass123", role=User.Role.HOTEL,
            )
            HotelProfile.objects.create(user=u, business_name="The Grand Kitchen", city="Mumbai")
