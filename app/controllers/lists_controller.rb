class ListsController < ApplicationController
  def index
    @list = List.new
    @lists = List.all
  end

  def create
    @list = List.new(list_params)
    @list.save

    respond_to do |format|
      format.html { redirect_to lists_path, notice: "List was successfully #{status}" }
      format.json { render :show, status: status }
    end
  end

  def destroy
    @list = List.find(params[:id])
    destroy_record(@list)
  end

  private

  def list_params
    params.require(:list).permit(:name)
  end
end
