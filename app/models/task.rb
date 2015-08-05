class Task < ActiveRecord::Base
  validates_presence_of :name
  validates_numericality_of :estimate, greater_than_or_equal_to: 1
  has_many :pomodori, dependent: :destroy

  def current_pomodoro_number
    pomodori.count + 1
  end

  def self.worked_today
    pomodori = Pomodoro.today
    pomodori.collect do |pom|
      pom.task
    end.uniq
  end

  def pomodori_today
    pomodori.today
  end

  def self.worked_week
    pomodori = Pomodoro.by_week
    pomodori.collect do |pom|
      pom.task
    end.uniq
  end
end
