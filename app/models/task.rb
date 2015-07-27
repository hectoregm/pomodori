class Task < ActiveRecord::Base
  validates_presence_of :name
  validates_numericality_of :estimate, greater_than_or_equal_to: 1
  has_many :pomodori, dependent: :destroy

  def current_pomodoro_number
    pomodori.count + 1
  end
end
