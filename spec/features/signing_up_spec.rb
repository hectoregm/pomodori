require 'rails_helper'

RSpec.describe 'Users can sign up', type: :feature do
  scenario 'when providing valid details' do
    visit '/'
    click_link 'Sign up'

    fill_in 'Email', with: 'text@example.com'
    fill_in 'user_password', with: 'password'
    fill_in 'Password confirmation', with: 'password'
    click_button 'Sign up'

    expect(page).to have_content('You have signed up successfully.')
  end
end
