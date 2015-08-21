require 'rails_helper'

RSpec.describe ListsController, type: :controller do
  let(:valid_attributes) do
    { name: 'New List' }
  end

  describe 'GET #index' do
    it 'returns http success' do
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    context 'with valid params' do
      it 'creates a new List' do
        expect do
          post :create, list: valid_attributes
        end.to change(List, :count).by(1)
      end

      it 'assigns a newly created task as @task' do
        post :create, list: valid_attributes
        expect(assigns(:list)).to be_a(List)
        expect(assigns(:list)).to be_persisted
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'destroys the requested list' do
      list = FactoryGirl.create(:list)
      expect do
        delete :destroy, id: list.to_param
      end.to change(List, :count).by(-1)
    end
  end
end
