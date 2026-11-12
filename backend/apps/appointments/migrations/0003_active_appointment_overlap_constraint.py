from django.db import migrations


def add_constraint(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return
    with schema_editor.connection.cursor() as cursor:
        cursor.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")
        cursor.execute(
            """
            ALTER TABLE apps_appointment
            ADD CONSTRAINT no_overlapping_active_appointments
            EXCLUDE USING gist (
                doctor_id WITH =,
                tstzrange(start_at, end_at) WITH &&
            )
            WHERE (status IN ('pending', 'confirmed') AND deleted_at IS NULL)
            """
        )


def remove_constraint(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            "ALTER TABLE apps_appointment "
            "DROP CONSTRAINT IF EXISTS no_overlapping_active_appointments"
        )


class Migration(migrations.Migration):
    dependencies = [("appointments", "0002_appointment_notes")]
    operations = [migrations.RunPython(add_constraint, remove_constraint)]
