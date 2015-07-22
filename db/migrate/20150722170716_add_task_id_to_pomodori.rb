class AddTaskIdToPomodori < ActiveRecord::Migration
  def change
    add_column :pomodori, :task_id, :integer, null: false
  end
end
