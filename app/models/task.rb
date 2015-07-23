class Task < ActiveRecord::Base
  validates_presence_of :name

  has_many :pomodori, dependent: :destroy
end
