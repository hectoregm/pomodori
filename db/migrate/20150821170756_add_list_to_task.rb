class AddListToTask < ActiveRecord::Migration
  def change
    add_column :tasks, :list_id, :integer
    add_column :tasks, :today, :boolean, default: false

    list = List.create(name: 'Alpha List')

    Task.all.each do |task|
      task.today = true unless task.done?
      list.tasks << task
    end
  end
end
