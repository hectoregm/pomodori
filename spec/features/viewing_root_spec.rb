require 'rails_helper'

RSpec.feature 'Root page' do

  scenario 'with anonymous user shows pomodori info' do
    visit root_path

    expect(page).to have_content 'Pomodori enables you to manage your time'
  end

  scenario 'logged in user is redirected to his dashboard' do
    user = FactoryGirl.create(:user)
    login_as(user)

    visit root_path
    expect(page).to have_content 'Pomodori Today'
    expect(page).to have_content 'Pomodori Week'
  end
end
