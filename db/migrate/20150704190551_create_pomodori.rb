class CreatePomodori < ActiveRecord::Migration
  def change
    create_table :pomodori do |t|
      t.datetime :started_at
      t.datetime :completed_at
      t.integer :length

      t.timestamps null: false
    end
  end
end
