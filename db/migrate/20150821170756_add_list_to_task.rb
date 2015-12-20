class AddListToTask < ActiveRecord::Migration
  def change
    add_column :tasks, :list_id, :integer
    add_column :tasks, :today, :boolean, default: false
  end
end
