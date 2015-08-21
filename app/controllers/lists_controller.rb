class ListsController < ApplicationController
  def index
    @list = List.new
    @lists = List.all
  end

  def create
    @list = List.new(list_params)
    handle_model(@list.save)
  end

  def destroy
    @list = List.find(params[:id])
    @list.destroy
    respond_to do |format|
      format.html { redirect_to lists_url, notice: 'List was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def handle_model(success, status = :created)
    respond_to do |format|
      if success
        format.html { redirect_to lists_path, notice: "List was successfully #{status}" }
        format.json { render :show, status: status, location: @task }
      else
        format.html do
          @tasks = Task.where(@query)
          render(status == :created ? :index : :edit)
        end
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def list_params
    params.require(:list).permit(:name)
  end
end
