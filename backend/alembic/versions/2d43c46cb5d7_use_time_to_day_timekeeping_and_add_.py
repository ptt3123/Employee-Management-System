"""Use Time to Day Timekeeping and add status Waiting to Leave Request

Revision ID: 2d43c46cb5d7
Revises: b77d463ea664
Create Date: 2025-07-28 12:25:26.138596

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2d43c46cb5d7'
down_revision: Union[str, Sequence[str], None] = 'b77d463ea664'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('day_timekeeping', 'shift_start',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.Time(),
               existing_nullable=False)
    op.alter_column('day_timekeeping', 'shift_end',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.Time(),
               existing_nullable=False)
    op.alter_column('day_timekeeping', 'checkin',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.Time(),
               existing_nullable=True)
    op.alter_column('day_timekeeping', 'checkout',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.Time(),
               existing_nullable=True)
    op.drop_column('day_timekeeping', 'is_enough_time')
    op.add_column('month_time_keeping', sa.Column('year', sa.Integer(), nullable=False))
    op.drop_column('month_time_keeping', 'expected_working_days')

    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('month_time_keeping', sa.Column('expected_working_days', sa.INTEGER(), autoincrement=False, nullable=False))
    op.drop_column('month_time_keeping', 'year')
    op.add_column('day_timekeeping', sa.Column('is_enough_time', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.alter_column('day_timekeeping', 'checkout',
               existing_type=sa.Time(),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=True)
    op.alter_column('day_timekeeping', 'checkin',
               existing_type=sa.Time(),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=True)
    op.alter_column('day_timekeeping', 'shift_end',
               existing_type=sa.Time(),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=False)
    op.alter_column('day_timekeeping', 'shift_start',
               existing_type=sa.Time(),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=False)
    # ### end Alembic commands ###
