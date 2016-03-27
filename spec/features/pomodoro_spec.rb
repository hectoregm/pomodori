require 'rails_helper'

RSpec.describe 'Pomodoro Timer', type: :feature do
  before do
    user = FactoryGirl.create(:user)
    task = FactoryGirl.create(:task, author: user)

    login_as(user)
    visit new_task_pomodoro_path(task)
  end

  scenario 'User loads timer' do
    expect(page).to have_css '#timer'
  end
end
