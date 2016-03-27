require 'rails_helper'

RSpec.feature 'Users can create new projects' do
  before do
    login_as(FactoryGirl.create(:user))
    visit projects_path
  end

  scenario 'with valid attributes' do
    fill_in 'project_name', with: 'Emacs'
    click_button 'Create Project'

    expect(page).to have_content 'Project was successfully created'
    expect(page).to have_content 'Emacs'
  end

  scenario 'with invalid attributes' do
    click_button 'Create Project'
    expect(page).to have_content "can't be blank"
  end
end
