class Pomodoro < ActiveRecord::Base
  validates_presence_of :task

  belongs_to :task
end
