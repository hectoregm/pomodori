require 'rails_helper'

RSpec.describe 'Pomodoro Timer', type: :feature do
  scenario 'User loads timer' do
    visit new_pomodoro_path

    expect(page).to have_css '#timer'
  end
end
