class Pomodoro < ActiveRecord::Base
  by_star_field :started_at

  validates_presence_of :task

  belongs_to :task

  def self.long_break?
    after(Time.current - 2.hours - 15.minutes).count == 4
  end
end
