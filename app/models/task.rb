class Task < ActiveRecord::Base
  validates_presence_of :name
  validates_numericality_of :estimate, greater_than_or_equal_to: 1
  has_many :pomodori, dependent: :destroy
  belongs_to :project
  belongs_to :author, class_name: 'User'

  def current_pomodoro_number
    pomodori.count + 1
  end

  def self.worked_today
    pomodori = Pomodoro.today
    pomodori.collect(&:task).uniq
  end

  def pomodori_today
    pomodori.today
  end

  def self.worked_week
    pomodori = Pomodoro.by_week
    pomodori.collect(&:task).uniq
  end

  def self.worked_at_day(datetime)
    pomodori = Pomodoro.between_times(datetime, datetime + 1.day)
    pomodori.collect(&:task).uniq
  end
end
