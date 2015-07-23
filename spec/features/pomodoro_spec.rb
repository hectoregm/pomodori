require 'rails_helper'

RSpec.describe 'Pomodoro Timer', type: :feature do
  scenario 'User loads timer' do
    task = FactoryGirl.create(:task)
    visit new_task_pomodoro_path(task)

    expect(page).to have_css '#timer'
  end
end
