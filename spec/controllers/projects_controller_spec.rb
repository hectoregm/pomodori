require 'rails_helper'

RSpec.describe ProjectsController, type: :controller do
  let(:valid_attributes) do
    { name: 'New Project' }
  end

  describe 'GET #index' do
    it 'returns http success' do
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    context 'with valid params' do
      it 'creates a new Project' do
        expect do
          post :create, project: valid_attributes
        end.to change(Project, :count).by(1)
      end

      it 'assigns a newly created task as @task' do
        post :create, project: valid_attributes
        expect(assigns(:project)).to be_a(Project)
        expect(assigns(:project)).to be_persisted
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'destroys the requested project' do
      project = FactoryGirl.create(:project)
      expect do
        delete :destroy, id: project.to_param
      end.to change(Project, :count).by(-1)
    end
  end
end
