require 'rails_helper'

RSpec.describe TodayController, type: :controller do
  describe 'GET #show' do
    it 'returns http success' do
      get :show
      expect(response).to have_http_status(:success)
    end

    it 'loads all of the posts into @posts' do
      task_one = FactoryGirl.create(:task, today: true)
      FactoryGirl.create(:task, today: false)
      task_two = FactoryGirl.create(:task, today: true)
      FactoryGirl.create(:task, today: true, done: true)
      get :show

      expect(assigns(:tasks)).to match_array([task_one, task_two])
    end
  end
end
