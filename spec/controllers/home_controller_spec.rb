require 'rails_helper'

RSpec.describe HomeController, type: :controller do
  describe 'GET #index' do
    it 'returns http success with anonymous user' do
      allow(controller).to receive(:current_user).and_return(nil)
      get :index
      expect(response).to have_http_status(:success)
    end

    it 'returns http redirect with signed in user' do
      user = FactoryGirl.create(:user)
      allow(controller).to receive(:current_user).and_return(user)
      get :index
      expect(response).to have_http_status(:redirect)
    end
  end
end
