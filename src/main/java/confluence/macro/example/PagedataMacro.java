package confluence.macro.example;
 
import java.util.Map;

import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.confluence.macro.MacroExecutionException;
import com.atlassian.confluence.pages.PageManager;
import com.atlassian.confluence.pages.Page;
import com.atlassian.confluence.spaces.SpaceManager;
import com.atlassian.confluence.user.AuthenticatedUserThreadLocal;
import com.atlassian.user.User;
import com.opensymphony.util.TextUtils;

import com.atlassian.confluence.json.json.JsonArray;
import com.atlassian.confluence.json.json.JsonObject;
import com.atlassian.confluence.renderer.radeox.macros.MacroUtils;
import com.atlassian.confluence.util.GeneralUtil;
import com.atlassian.confluence.util.velocity.VelocityUtils;
import org.apache.velocity.VelocityContext;
 
public class PagedataMacro implements Macro
{
 
  public PagedataMacro()
  {
  }

  private static final String PAGEDATA = "pagedata";
  private static final String TEMPLATE = "templates/pagedatamacro.vm";
 
  @Override
  public BodyType getBodyType()
  {
     return BodyType.NONE;
  }
 
  @Override
  public OutputType getOutputType()
  {
     return OutputType.INLINE;
  }

  @Override
  public String execute(Map<String, String> params, String body, ConversionContext conversionContext)
                                                                       throws MacroExecutionException
  {

    VelocityContext contextMap = new VelocityContext(MacroUtils.defaultVelocityContext());
    contextMap.put(PAGEDATA, params.get("pagedata"));
    return VelocityUtils.getRenderedTemplate(TEMPLATE, contextMap);

  }

}
