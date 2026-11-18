require 'open3'

module CatalogueEditDateFilter
  def catalogue_edit_date(path)
    source = @context.registers[:site].source
    date, status = Open3.capture2(
      'git', '-c', "safe.directory=#{source}", 'log', '-1', '--format=%cI',
      '--', path, chdir: source, err: File::NULL
    )
    date.strip if status.success? && !date.empty?
  rescue Errno::ENOENT
    nil
  end
end

Liquid::Template.register_filter(CatalogueEditDateFilter)
