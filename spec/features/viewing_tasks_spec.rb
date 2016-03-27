require 'rails_helper'

RSpec.feature 'Users can view tasks' do
  let(:author) { FactoryGirl.create(:user) }

  before do
    emacs = FactoryGirl.create(:project,
                               user: author,
                               name: 'Emacs')
    ml = FactoryGirl.create(:project,
                            user: author,
                            name: 'Machine Learning')

    FactoryGirl.create(:task,
                       project: emacs,
                       author: author,
                       name: 'Write Ruby snippets')

    login_as(author)
    visit projects_path
  end

  scenario 'for a given project' do
    click_link 'Emacs'
    expect(page).to have_content 'Write Ruby snippets'

    click_link 'Write Ruby snippets'

    expect(page).to have_content "Author: #{author.email}"
  end
end
