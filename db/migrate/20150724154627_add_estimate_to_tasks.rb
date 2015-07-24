class AddEstimateToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :estimate, :integer, default: 2, null: false
  end
end
