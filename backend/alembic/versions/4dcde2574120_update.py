"""update

Revision ID: 4dcde2574120
Revises: b77d463ea664
Create Date: 2025-07-27 23:51:17.839879

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '4dcde2574120'
down_revision: Union[str, Sequence[str], None] = 'b77d463ea664'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('employee',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=25), nullable=False),
    sa.Column('password', sa.String(length=100), nullable=False),
    sa.Column('status', sa.Enum('ACTIVE', 'RESIGNED', 'TERMINATED', 'RETIRED', name='employeestatus'), nullable=False),
    sa.Column('role', sa.Enum('ADMIN', 'MANAGER', 'STAFF', name='employeerole'), nullable=False),
    sa.Column('create_date', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('update_date', sa.DateTime(), nullable=True),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('phone_number', sa.String(length=10), nullable=False),
    sa.Column('address', sa.String(length=100), nullable=True),
    sa.Column('dob', sa.Date(), nullable=True),
    sa.Column('position', sa.Enum('IT', 'QA', 'BA', 'TESTER', 'PM', name='employeeposition'), nullable=True),
    sa.Column('team_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['team_id'], ['team.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('phone_number'),
    sa.UniqueConstraint('username')
    )
    op.create_index(op.f('ix_employee_id'), 'employee', ['id'], unique=False)
    op.drop_index(op.f('ix_employee_id'), table_name='employee_schemas')
    op.drop_table('employee_schemas')
    op.drop_constraint(op.f('balance_employee_id_fkey'), 'balance', type_='foreignkey')
    op.create_foreign_key(None, 'balance', 'employee', ['employee_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(op.f('day_timekeeping_employee_id_fkey'), 'day_timekeeping', type_='foreignkey')
    op.create_foreign_key(None, 'day_timekeeping', 'employee', ['employee_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(op.f('leave_request_employee_id_fkey'), 'leave_request', type_='foreignkey')
    op.drop_constraint(op.f('leave_request_manager_id_fkey'), 'leave_request', type_='foreignkey')
    op.create_foreign_key(None, 'leave_request', 'employee', ['manager_id'], ['id'], ondelete='SET NULL')
    op.create_foreign_key(None, 'leave_request', 'employee', ['employee_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(op.f('month_time_keeping_employee_id_fkey'), 'month_time_keeping', type_='foreignkey')
    op.create_foreign_key(None, 'month_time_keeping', 'employee', ['employee_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(op.f('salary_employee_id_fkey'), 'salary', type_='foreignkey')
    op.create_foreign_key(None, 'salary', 'employee', ['employee_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'salary', type_='foreignkey')
    op.create_foreign_key(op.f('salary_employee_id_fkey'), 'salary', 'employee_schemas', ['employee_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(None, 'month_time_keeping', type_='foreignkey')
    op.create_foreign_key(op.f('month_time_keeping_employee_id_fkey'), 'month_time_keeping', 'employee_schemas', ['employee_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(None, 'leave_request', type_='foreignkey')
    op.drop_constraint(None, 'leave_request', type_='foreignkey')
    op.create_foreign_key(op.f('leave_request_manager_id_fkey'), 'leave_request', 'employee_schemas', ['manager_id'], ['id'], ondelete='SET NULL')
    op.create_foreign_key(op.f('leave_request_employee_id_fkey'), 'leave_request', 'employee_schemas', ['employee_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(None, 'day_timekeeping', type_='foreignkey')
    op.create_foreign_key(op.f('day_timekeeping_employee_id_fkey'), 'day_timekeeping', 'employee_schemas', ['employee_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(None, 'balance', type_='foreignkey')
    op.create_foreign_key(op.f('balance_employee_id_fkey'), 'balance', 'employee_schemas', ['employee_id'], ['id'], ondelete='CASCADE')
    op.create_table('employee_schemas',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('username', sa.VARCHAR(length=25), autoincrement=False, nullable=False),
    sa.Column('password', sa.VARCHAR(length=100), autoincrement=False, nullable=False),
    sa.Column('status', postgresql.ENUM('ACTIVE', 'RESIGNED', 'TERMINATED', 'RETIRED', name='employeestatus'), autoincrement=False, nullable=False),
    sa.Column('role', postgresql.ENUM('ADMIN', 'MANAGER', 'STAFF', name='employeerole'), autoincrement=False, nullable=False),
    sa.Column('create_date', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('update_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('name', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('phone_number', sa.VARCHAR(length=10), autoincrement=False, nullable=False),
    sa.Column('address', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
    sa.Column('dob', sa.DATE(), autoincrement=False, nullable=True),
    sa.Column('position', postgresql.ENUM('IT', 'QA', 'BA', 'TESTER', 'PM', name='employeeposition'), autoincrement=False, nullable=True),
    sa.Column('team_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['team_id'], ['team.id'], name=op.f('employee_schemas_team_id_fkey'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('employee_schemas_pkey')),
    sa.UniqueConstraint('email', name=op.f('employee_schemas_email_key'), postgresql_include=[], postgresql_nulls_not_distinct=False),
    sa.UniqueConstraint('phone_number', name=op.f('employee_schemas_phone_number_key'), postgresql_include=[], postgresql_nulls_not_distinct=False),
    sa.UniqueConstraint('username', name=op.f('employee_schemas_username_key'), postgresql_include=[], postgresql_nulls_not_distinct=False)
    )
    op.create_index(op.f('ix_employee_id'), 'employee_schemas', ['id'], unique=False)
    op.drop_index(op.f('ix_employee_id'), table_name='employee')
    op.drop_table('employee')
    # ### end Alembic commands ###
