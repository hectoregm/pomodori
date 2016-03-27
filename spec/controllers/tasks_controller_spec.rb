require 'rails_helper'

RSpec.describe TasksController, type: :controller do
  let(:user) { FactoryGirl.create(:user) }
  let(:project) { FactoryGirl.create(:project) }
    
  let(:valid_attributes) do
    { name: 'Task Foo', done: false, project_id: project.id }
  end

  let(:invalid_attributes) do
    { name: '' }
  end

  let(:valid_session) { {} }

  before do
    allow(controller).to receive(:authenticate_user!)
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'GET #index' do
    it 'assigns all tasks as @tasks' do
      task = FactoryGirl.create(:task)
      get :index, project_id: task.project_id
      expect(assigns(:tasks)).to eq([task])
    end
  end

  describe 'GET #show' do
    it 'assigns the requested task as @task' do
      task = Task.create! valid_attributes
      get :show, id: task.to_param
      expect(assigns(:task)).to eq(task)
    end

    it 'assigns the associated pomodori for the task to @pomodori' do
      task = Task.create! valid_attributes
      pomodoro = FactoryGirl.create(:pomodoro, task: task)

      get :show, id: task.to_param
      expect(assigns(:pomodori)).to eq([pomodoro])
    end
  end

  describe "GET #new" do
    it "assigns a new task as @task" do
      get :new, {}, valid_session
      expect(assigns(:task)).to be_a_new(Task)
    end
  end

  describe "GET #edit" do
    it "assigns the requested task as @task" do
      task = Task.create! valid_attributes
      get :edit, {:id => task.to_param}, valid_session
      expect(assigns(:task)).to eq(task)
    end
  end

  describe 'POST #create' do
    context 'with valid params' do
      it 'creates a new Task' do
        expect do
          post :create, project_id: project.id, task: valid_attributes
        end.to change(Task, :count).by(1)
      end

      it 'assigns a newly created task as @task' do
        post :create, project_id: project.id, task: valid_attributes
        expect(assigns(:task)).to be_a(Task)
        expect(assigns(:task)).to be_persisted
      end

      it 'redirects to the task project' do
        post :create, project_id: project.id, task: valid_attributes
        expect(response).to redirect_to(project_tasks_path(project))
      end
    end

    context 'with invalid params' do
      it 'assigns a newly created but unsaved task as @task' do
        post :create, project_id: project.id, task: invalid_attributes
        expect(assigns(:task)).to be_a_new(Task)
      end

      it 're-renders the "index" template' do
        post :create, project_id: project.id, task: invalid_attributes
        expect(response).to render_template('index')
      end
    end
  end

  describe 'PUT #update' do
    let(:task) do
      FactoryGirl.create(:task)
    end

    context 'with valid params' do
      let(:new_attributes) do
        { name: 'New task name' }
      end

      it 'updates the requested task' do
        put :update, project_id: project.id, id: task.to_param, task: new_attributes
        task.reload
      end

      it 'assigns the requested task as @task' do
        put :update, project_id: project.id, id: task.to_param, task: new_attributes
        expect(assigns(:task)).to eq(task)
      end

      it 'redirects to the tasks project' do
        put :update, project_id: task.project_id, id: task.to_param, task: new_attributes
        expect(response).to redirect_to(project_tasks_path(task.project_id))
      end
    end

    context 'with invalid params' do
      it 'assigns the task as @task' do
        put :update, project_id: project.id, id: task.to_param, task: invalid_attributes
        expect(assigns(:task)).to eq(task)
      end

      it "re-renders the 'edit' template" do
        task = Task.create! valid_attributes
        put :update, project_id: project.id, id: task.to_param, task: invalid_attributes
        expect(response).to render_template('edit')
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'destroys the requested task' do
      task = Task.create! valid_attributes
      expect {
        delete :destroy, {:id => task.to_param}, valid_session
      }.to change(Task, :count).by(-1)
    end

    it 'redirects to the tasks project' do
      task = Task.create! valid_attributes
      delete :destroy, {:id => task.to_param}, valid_session
      expect(response).to redirect_to(project_tasks_path(task.project))
    end
  end

end
