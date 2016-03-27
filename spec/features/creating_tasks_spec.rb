require 'rails_helper'

RSpec.feature 'Users can create tasks' do
  let(:user) { FactoryGirl.create(:user) }

  before do
    login_as(user)
    project = FactoryGirl.create(:project, name: 'Emacs')

    visit project_tasks_path(project)
  end

  scenario 'with valid attributes' do
    fill_in 'task_name', with: 'Write Ruby snippets'
    click_button 'Create Task'

    expect(page).to have_content 'Task was successfully created'
    expect(page).to have_content 'Write Ruby snippets'
  end
end
