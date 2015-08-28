class RenameListtoProject < ActiveRecord::Migration
  def change
    rename_table :lists, :projects
    rename_column :tasks, :list_id, :project_id
  end
end
