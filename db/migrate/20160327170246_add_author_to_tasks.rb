class AddAuthorToTasks < ActiveRecord::Migration
  def change
    add_reference :tasks, :author, index: true
    add_foreign_key :tasks, :users, column: :author_id
  end
end
